from flask import Flask, request, jsonify, render_template
import database

app = Flask(__name__)


# Endpoint to get all products
@app.route('/products', methods=['GET'])
def get_products():
    products = database.get_all_products()
    return jsonify(products)


# Endpoint to create a new order
@app.route('/order', methods=['POST'])
def new_order():
    # Assume the data is sent as JSON
    data = request.json
    email = data['email']
    password = data['password']  # Remember to handle the password securely
    product_ids = data['product_ids']
    quantities = data['quantities']

    # Validate the inputs as necessary
    # ...

    order_id = database.create_order(email, password, product_ids, quantities)
    return jsonify({"order_id": order_id}), 201


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
