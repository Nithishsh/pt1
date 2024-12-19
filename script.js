// Fetch the portfolio and display it
function fetchPortfolio() {
    fetch('/portfolio')
        .then(response => response.json())
        .then(data => {
            const portfolioTable = document.getElementById('portfolio-table').getElementsByTagName('tbody')[0];
            portfolioTable.innerHTML = '';  // Clear any existing rows
            let totalValue = 0;

            data.portfolio.forEach((stock, index) => {
                const row = portfolioTable.insertRow();
                row.innerHTML = `
                    <td>${stock.symbol}</td>
                    <td>${stock.quantity}</td>
                    <td>${stock.price.toFixed(2)}</td>
                    <td>${(stock.quantity * stock.price).toFixed(2)}</td>
                    <td><button onclick="deleteStock(${index})">Delete</button></td>
                `;
                totalValue += stock.quantity * stock.price;
            });

            document.getElementById('total-value').innerText = `$${totalValue.toFixed(2)}`;
        })
        .catch(err => {
            console.error('Error fetching portfolio:', err);
        });
}

// Handle form submission to add stock
document.getElementById('add-stock-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    const quantity = parseInt(document.getElementById('quantity').value);

    if (symbol && quantity > 0) {
        fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol, quantity })
        })
        .then(response => response.json())
        .then(data => {
            fetchPortfolio();  // Refresh portfolio after adding stock
            document.getElementById('symbol').value = '';
            document.getElementById('quantity').value = '';
        })
        .catch(err => {
            console.error('Error adding stock:', err);
        });
    }
});

// Delete a stock from the portfolio
function deleteStock(index) {
    fetch(`/delete/${index}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            fetchPortfolio();  // Refresh portfolio after deletion
        })
        .catch(err => {
            console.error('Error deleting stock:', err);
        });
}

// Initial load of the portfolio when page is loaded
window.onload = fetchPortfolio;
