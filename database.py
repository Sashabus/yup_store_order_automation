import sqlite3


# Establish a connection to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('database/yup_db.db')
    conn.row_factory = sqlite3.Row
    return conn


# Retrieve all products from the product_info table
def get_all_products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM product_info').fetchall()
    conn.close()
    return [dict(product) for product in products]


# Insert a new order into the order_info table
def create_order(email, password, product_ids, quantities):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert the order into order_info
    cursor.execute('INSERT INTO order_info (email, password, status) VALUES (?, ?, ?)',
                   (email, password, 'pending'))

    order_id = cursor.lastrowid

    # Insert each product into the order_products table
    for product_id, quantity in zip(product_ids, quantities):
        cursor.execute('INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)',
                       (order_id, product_id, quantity))

    # Commit the transaction
    conn.commit()
    conn.close()
    return order_id


# Retrieve product details by product_id
def get_product_by_id(product_id):
    conn = get_db_connection()
    product = conn.execute('SELECT * FROM product_info WHERE product_id = ?',
                           (product_id,)).fetchone()
    conn.close()
    return dict(product) if product else None
