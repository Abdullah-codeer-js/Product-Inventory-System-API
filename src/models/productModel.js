const pool = require('./db');

async function getProductColumns() {
    const result = await pool.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'products'
         ORDER BY ordinal_position`
    );
    return new Set(result.rows.map(row => row.column_name));
}

exports.readfile = async () => {
    try {
        const products = await pool.query('SELECT * FROM products ORDER BY id');
        return products.rows;
    } catch (error) {
        console.log('Data reading error: ', error.message);
        throw error;
    }
};

exports.writefile = async (data) => {
    try {
        const columns = await getProductColumns();
        const name = data.name ?? data.prod_name;
        const price = data.price;
        const sku = data.sku;
        const quantity = data.quantity;
        const category = data.category;
        const values = [name, price, sku, quantity, category];
        const insertColumns = ['name', 'price', 'sku', 'quantity', 'category'];

        if (columns.has('valid_date') && data.valid_date !== undefined && data.valid_date !== null && data.valid_date !== '') {
            insertColumns.push('valid_date');
            values.push(data.valid_date);
        }

        const paramValues = [...values];
        const placeholders = [];

        for (let i = 0; i < paramValues.length; i++) {
            placeholders.push(`$${i + 1}`);
        }

        if (columns.has('created_at')) {
            insertColumns.push('created_at');
            placeholders.push('CURRENT_TIMESTAMP');
        }

        const query = `INSERT INTO products (${insertColumns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
        const result = await pool.query(query, paramValues);
        return result.rows[0];
    } catch (error) {
        console.log('data writing error', error.message);
        throw error;
    }
};

exports.updatefile = async (id, updatedDate) => {
    try {
        const columns = await getProductColumns();
        const fields = Object.keys(updatedDate);

        if (fields.length === 0) {
            return null;
        }

        const normalizedFields = fields
            .map(field => field === 'prod_name' ? 'name' : field)
            .filter(field => columns.has(field));

        if (normalizedFields.length === 0) {
            return null;
        }

        const setClauses = normalizedFields.map((field, index) => `${field} = $${index + 1}`);
        setClauses.push('updated_at = NOW()');

        const values = normalizedFields.map(field => updatedDate[field === 'name' && updatedDate.prod_name !== undefined ? 'prod_name' : field]);
        values.push(id);

        const queryText = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
        const result = await pool.query(queryText, values);
        return result.rows[0];
    } catch (error) {
        console.error('database update error: ', error.message);
        throw error;
    }
};

exports.deletefile = async (id) => {
    try {
        const queryText = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const result = await pool.query(queryText, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('dataBase delete error:', error.message);
        throw error;
    }
};
