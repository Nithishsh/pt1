from flask import Flask, jsonify, request
import yfinance as yf

app = Flask(__name__)

# Stock Portfolio (in-memory database for simplicity)
portfolio = []

# Helper function to fetch real-time stock prices
def get_stock_price(symbol):
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")
    return data['Close'].iloc[0]  # Latest closing price

# API route to add a stock holding
@app.route('/add', methods=['POST'])
def add_stock():
    data = request.get_json()
    symbol = data['symbol']
    quantity = data['quantity']

    # Get the current price for the stock
    price = get_stock_price(symbol)

    # Add stock to portfolio
    portfolio.append({
        'symbol': symbol,
        'quantity': quantity,
        'price': price
    })

    return jsonify({'message': 'Stock added successfully'}), 201

# API route to get all stock holdings
@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify({'portfolio': portfolio})

# API route to edit a stock holding
@app.route('/edit/<int:index>', methods=['PUT'])
def edit_stock(index):
    data = request.get_json()
    symbol = data['symbol']
    quantity = data['quantity']

    # Get the current price for the stock
    price = get_stock_price(symbol)

    # Edit the stock at the given index
    if index < len(portfolio):
        portfolio[index]['symbol'] = symbol
        portfolio[index]['quantity'] = quantity
        portfolio[index]['price'] = price
        return jsonify({'message': 'Stock updated successfully'})
    return jsonify({'message': 'Stock not found'}), 404

# API route to delete a stock holding
@app.route('/delete/<int:index>', methods=['DELETE'])
def delete_stock(index):
    if index < len(portfolio):
        del portfolio[index]
        return jsonify({'message': 'Stock deleted successfully'})
    return jsonify({'message': 'Stock not found'}), 404

# API route to get the total portfolio value
@app.route('/total-value', methods=['GET'])
def total_value():
    total = 0
    for stock in portfolio:
        total += stock['quantity'] * stock['price']
    return jsonify({'total_value': total})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
