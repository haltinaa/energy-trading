// app.js
let web3;
let contract;
let userAccount;
let isConnected = false;
let energyChart;
const chartData = {
    labels: [],
    values: []
};
let energyChartUpdateInterval;


// Замените этот адрес на адрес вашего развернутого контракта
const contractAddress = '0x937e3B95a52b71B3a2E2983F885D6327C7dE4913';

// Вставьте сюда ABI вашего контракта
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_energyAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_pricePerUnit",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_energyType",
                "type": "string"
            }
        ],
        "name": "createEnergyListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "EnergyListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newOutput",
                "type": "uint256"
            }
        ],
        "name": "EnergyOutputUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "consumer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "EnergyPurchased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_listingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "purchaseEnergy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_userType",
                "type": "string"
            }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newEnergy",
                "type": "uint256"
            }
        ],
        "name": "updateEnergyMeterData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_currentOutput",
                "type": "uint256"
            }
        ],
        "name": "updateEnergyOutput",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "userType",
                "type": "string"
            }
        ],
        "name": "UserRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_provider",
                "type": "address"
            }
        ],
        "name": "getCurrentEnergyOutput",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_listingId",
                "type": "uint256"
            }
        ],
        "name": "getListing",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "provider",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "energyAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pricePerUnit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "string",
                        "name": "energyType",
                        "type": "string"
                    }
                ],
                "internalType": "struct EnergyTrading.EnergyListing",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getPurchaseHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "listingId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "provider",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "energyType",
                        "type": "string"
                    }
                ],
                "internalType": "struct EnergyTrading.PurchaseRecord[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
            }
        ],
        "name": "getUserInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "energyBalance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "userType",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentEnergyOutput",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct EnergyTrading.User",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "listingCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "listings",
        "outputs": [
            {
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "energyAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "pricePerUnit",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "energyType",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "purchaseHistory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "energyType",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "energyBalance",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "userType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "currentEnergyOutput",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; // Вставьте сюда ABI из Remix

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Запрашиваем доступ к аккаунту
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];

            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Обновляем UI
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('userSection').classList.remove('hidden');
            document.getElementById('walletAddress').textContent =
                `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;

            isConnected = true;

            // Проверяем регистрацию после подключения
            await checkUserRegistration();

            return true;
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Error connecting to MetaMask: ' + error.message);
            return false;
        }
    } else {
        alert('Please install MetaMask!');
        return false;
    }
}

async function disconnectWallet() {
    try {
        if (energyChartUpdateInterval) {
            clearInterval(energyChartUpdateInterval);
        }
        // Сбрасываем состояние приложения
        isConnected = false;
        userAccount = null;

        // Обновляем UI
        document.getElementById('connectWallet').style.display = 'block';
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('userName').textContent = '';
        document.getElementById('userType').textContent = '';
        document.getElementById('walletAddress').textContent = '';

        // Скрываем все секции
        document.getElementById('registrationSection').style.display = 'none';
        document.getElementById('providerSection').style.display = 'none';
        document.getElementById('consumerSection').style.display = 'none';

        // Если есть график, уничтожаем его
        if (energyChart) {
            energyChart.destroy();
            energyChart = null;
        }

        // Очищаем данные графика
        chartData.labels = [];
        chartData.values = [];

    } catch (error) {
        console.error('Error disconnecting wallet:', error);
        alert('Error disconnecting wallet: ' + error.message);
    }
}

async function checkUserRegistration() {
    try {
        const userInfo = await contract.methods.getUserInfo(userAccount).call();

        if (userInfo.isRegistered) {
            document.getElementById('registrationSection').style.display = 'none';

            // Обновляем информацию о пользователе в шапке
            document.getElementById('userName').textContent = userInfo.name;
            document.getElementById('userType').textContent =
                `${userInfo.userType.charAt(0).toUpperCase()}${userInfo.userType.slice(1)}`;

            if (userInfo.userType === 'provider') {
                document.getElementById('providerSection').style.display = 'block';
                document.getElementById('consumerSection').style.display = 'none';
                await loadProviderStatistics();
                initializeEnergyChart();
                const currentOutput = await contract.methods.getCurrentEnergyOutput(userAccount).call();
                document.getElementById('currentOutput').textContent = `${currentOutput} kWh`;
            } else {
                document.getElementById('providerSection').style.display = 'none';
                document.getElementById('consumerSection').style.display = 'block';
                await loadListings();
                await loadPurchaseHistory();
            }
        } else {
            document.getElementById('registrationSection').style.display = 'block';
            document.getElementById('providerSection').style.display = 'none';
            document.getElementById('consumerSection').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking registration:', error);
        alert('Error checking registration: ' + error.message);
    }
}

// Обновляем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('logoutButton').addEventListener('click', disconnectWallet);
    document.getElementById('registerUser').addEventListener('click', registerUser);
    document.getElementById('createListing').addEventListener('click', createEnergyListing);

    // Проверяем, есть ли уже подключение к MetaMask
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        connectWallet();
    }
});

async function registerUser() {
    const nameInput = document.getElementById('registerName'); // Изменим id в HTML
    const userTypeSelect = document.getElementById('registerUserType'); // Изменим id в HTML

    const name = nameInput.value;
    const userType = userTypeSelect.value;

    if (!name || !userType) {
        alert('Please fill in all fields');
        return;
    }

    try {
        if (!isConnected) {
            const connected = await connectWallet();
            if (!connected) return;
        }

        // Добавим проверку перед вызовом контракта
        if (!contract || !contract.methods) {
            alert('Contract not initialized properly');
            return;
        }

        const tx = await contract.methods.registerUser(name, userType)
            .send({
                from: userAccount,
                gas: 200000 // Добавляем лимит газа
            });

        console.log('Registration transaction:', tx);
        alert('Registration successful!');

        // Очищаем поля после успешной регистрации
        nameInput.value = '';

        await checkUserRegistration();
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user: ' + error.message);
    }
}


async function createEnergyListing() {
    const amount = document.getElementById('energyAmount').value;
    const price = document.getElementById('energyPrice').value;
    const type = document.getElementById('energyType').value;

    if (!amount || !price || !type) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const tx = await contract.methods.createEnergyListing(
            web3.utils.toBN(amount),
            web3.utils.toBN(price),
            type
        ).send({ from: userAccount });

        console.log('Listing created:', tx);
        alert('Energy listing created successfully!');

        // Очищаем поля ввода
        document.getElementById('energyAmount').value = '';
        document.getElementById('energyPrice').value = '';

        // Обновляем список листингов
        await loadListings();
    } catch (error) {
        console.error('Error creating listing:', error);
        alert('Error creating listing: ' + error.message);
    }
}

async function loadListings() {
    try {
        const listingCount = await contract.methods.listingCount().call();
        const listingsContainer = document.getElementById('listingsContainer');
        listingsContainer.innerHTML = '';

        for (let i = 0; i < listingCount; i++) {
            const listing = await contract.methods.getListing(i).call();
            if (listing.isActive) {
                const listingElement = createListingElement(listing, i);
                listingsContainer.appendChild(listingElement);
            }
        }
    } catch (error) {
        console.error('Error loading listings:', error);
    }
}

function createListingElement(listing, id) {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 p-4 rounded-lg mb-4';
    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <p class="font-semibold">Provider: ${listing.provider.substring(0, 6)}...${listing.provider.substring(38)}</p>
                <p>Energy Amount: ${listing.energyAmount} kWh</p>
                <p>Price per kWh: ${listing.pricePerUnit} Wei</p>
                <p>Type: ${listing.energyType}</p>
            </div>
            <div class="text-right">
                <input type="number" 
                    id="amount-${id}" 
                    placeholder="Amount to purchase" 
                    class="mb-2 p-2 border rounded"
                    min="1" 
                    max="${listing.energyAmount}">
                <button onclick="purchaseEnergy(${id})" 
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Purchase
                </button>
            </div>
        </div>
    `;
    return div;
}

// Обновляем функцию purchaseEnergy
async function purchaseEnergy(listingId) {
    const amountInput = document.getElementById(`amount-${listingId}`);
    const amount = amountInput.value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const listing = await contract.methods.getListing(listingId).call();
        const totalCost = web3.utils.toBN(amount).mul(web3.utils.toBN(listing.pricePerUnit));

        const tx = await contract.methods.purchaseEnergy(listingId, amount)
            .send({
                from: userAccount,
                value: totalCost
            });

        console.log('Purchase transaction:', tx);
        alert('Energy purchased successfully!');

        // Обновляем список листингов и историю покупок
        await Promise.all([
            loadListings(),
            loadPurchaseHistory() // Добавляем обновление истории покупок
        ]);
    } catch (error) {
        console.error('Error purchasing energy:', error);
        alert('Error purchasing energy: ' + error.message);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('registerUser').addEventListener('click', registerUser);
    document.getElementById('createListing').addEventListener('click', createEnergyListing);

    // Проверяем, есть ли уже подключение к MetaMask
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        connectWallet();
    }
});

// Слушатель событий для изменения аккаунта MetaMask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async function (accounts) {
        if (accounts.length > 0) {
            // Если сменился аккаунт, переподключаемся
            userAccount = accounts[0];
            await checkUserRegistration();
        } else {
            // Если все аккаунты отключены
            await disconnectWallet();
        }
    });

    window.ethereum.on('disconnect', async () => {
        await disconnectWallet();
    });

    window.ethereum.on('chainChanged', () => {
        // При смене сети перезагружаем страницу
        window.location.reload();
    });
}
// Добавьте эти функции в ваш существующий app.js

async function loadProviderStatistics() {
    try {
        const listingCount = await contract.methods.listingCount().call();
        let activeListings = 0;
        let totalEnergy = 0;

        for (let i = 0; i < listingCount; i++) {
            const listing = await contract.methods.getListing(i).call();
            if (listing.provider.toLowerCase() === userAccount.toLowerCase() && listing.isActive) {
                activeListings++;
                totalEnergy += parseInt(listing.energyAmount);
            }
        }

        document.getElementById('totalListings').textContent = activeListings;
        document.getElementById('totalEnergy').textContent = `${totalEnergy} kWh`;

        // Обновляем таблицу листингов
        await loadProviderListings();
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadProviderListings() {
    try {
        const listingCount = await contract.methods.listingCount().call();
        const tableBody = document.getElementById('providerListings');
        tableBody.innerHTML = '';

        for (let i = 0; i < listingCount; i++) {
            const listing = await contract.methods.getListing(i).call();
            if (listing.provider.toLowerCase() === userAccount.toLowerCase()) {
                const row = document.createElement('tr');
                row.className = listing.isActive ? 'bg-white' : 'bg-gray-50';

                row.innerHTML = `
                    <td class="py-3 px-4">${i}</td>
                    <td class="py-3 px-4">${listing.energyType}</td>
                    <td class="py-3 px-4">${listing.energyAmount} kWh</td>
                    <td class="py-3 px-4">${listing.pricePerUnit} Wei</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded-full text-sm ${listing.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${listing.isActive ? 'Active' : 'Sold'}
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        ${listing.isActive ? `
                            <button onclick="cancelListing(${i})" 
                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                Cancel
                            </button>
                        ` : ''}
                    </td>
                `;

                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        console.error('Error loading provider listings:', error);
    }
}

// Обновляем существующую функцию createEnergyListing
async function createEnergyListing() {
    const amount = document.getElementById('energyAmount').value;
    const price = document.getElementById('energyPrice').value;
    const type = document.getElementById('energyType').value;

    if (!amount || !price || !type) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const tx = await contract.methods.createEnergyListing(
            web3.utils.toBN(amount),
            web3.utils.toBN(price),
            type
        ).send({ from: userAccount });

        console.log('Listing created:', tx);
        alert('Energy listing created successfully!');

        // Очищаем поля ввода
        document.getElementById('energyAmount').value = '';
        document.getElementById('energyPrice').value = '';

        // Обновляем статистику и список листингов
        await loadProviderStatistics();
    } catch (error) {
        console.error('Error creating listing:', error);
        alert('Error creating listing: ' + error.message);
    }
}

// Добавляем функцию для отмены листинга (опционально, если это предусмотрено в смарт-контракте)
async function cancelListing(listingId) {
    try {
        // Предполагая, что в вашем контракте есть метод cancelListing
        await contract.methods.cancelListing(listingId).send({ from: userAccount });
        alert('Listing cancelled successfully!');
        await loadProviderStatistics();
    } catch (error) {
        console.error('Error cancelling listing:', error);
        alert('Error cancelling listing: ' + error.message);
    }
}

// Обновляем функцию checkUserRegistration
async function checkUserRegistration() {
    try {
        const userInfo = await contract.methods.getUserInfo(userAccount).call();

        if (userInfo.isRegistered) {
            document.getElementById('registrationSection').style.display = 'none';
            document.getElementById('userName').textContent = userInfo.name;
            document.getElementById('userType').textContent =
                `${userInfo.userType.charAt(0).toUpperCase()}${userInfo.userType.slice(1)}`;

            if (userInfo.userType === 'provider') {
                document.getElementById('providerSection').style.display = 'block';
                document.getElementById('consumerSection').style.display = 'none';
                await loadProviderStatistics();
            } else {
                document.getElementById('providerSection').style.display = 'none';
                document.getElementById('consumerSection').style.display = 'block';
                await Promise.all([
                    loadListings(),
                    loadPurchaseHistory() // Гарантируем загрузку истории при входе
                ]);
            }
        } else {
            document.getElementById('registrationSection').style.display = 'block';
            document.getElementById('providerSection').style.display = 'none';
            document.getElementById('consumerSection').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking registration:', error);
        alert('Error checking registration: ' + error.message);
    }
}

async function updateEnergyOutput() {
    const newOutput = document.getElementById('newEnergyOutput').value;

    if (!newOutput || newOutput < 0) {
        alert('Please enter a valid energy output value');
        return;
    }

    try {
        await contract.methods.updateEnergyOutput(web3.utils.toBN(newOutput))
            .send({ from: userAccount });

        document.getElementById('currentOutput').textContent = `${newOutput} kWh`;
        updateEnergyChart(newOutput);
        document.getElementById('newEnergyOutput').value = '';
    } catch (error) {
        console.error('Error updating energy output:', error);
        alert('Error updating energy output: ' + error.message);
    }
}

// Add this function to initialize and update the chart
function initializeEnergyChart() {
    const ctx = document.getElementById('energyOutputChart').getContext('2d');

    // Уничтожаем существующий график если есть
    if (energyChart) {
        energyChart.destroy();
    }

    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Energy Output (kWh)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Output (kWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Real-time Energy Output'
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });

    // Запускаем автоматическое обновление каждую минуту
    if (energyChartUpdateInterval) {
        clearInterval(energyChartUpdateInterval);
    }

    energyChartUpdateInterval = setInterval(async () => {
        try {
            const currentOutput = await contract.methods.getCurrentEnergyOutput(userAccount).call();
            updateEnergyChart(parseInt(currentOutput));
        } catch (error) {
            console.error('Error updating energy chart:', error);
        }
    }, 60000); // Обновление каждую минуту
}

function updateEnergyChart(newValue) {
    const now = new Date().toLocaleTimeString();

    // Ограничиваем количество точек на графике
    const maxDataPoints = 10;

    if (energyChart.data.labels.length >= maxDataPoints) {
        energyChart.data.labels.shift();
        energyChart.data.datasets[0].data.shift();
    }

    energyChart.data.labels.push(now);
    energyChart.data.datasets[0].data.push(newValue);

    energyChart.update();
}

// Add this function to load purchase history
async function loadPurchaseHistory() {
    try {
        const history = await contract.methods.getPurchaseHistory(userAccount).call();
        const tableBody = document.getElementById('purchaseHistory');

        if (!tableBody) {
            console.error('Purchase history table body not found');
            return;
        }

        tableBody.innerHTML = '';

        // Сортируем историю по временной метке (самые новые сверху)
        const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

        sortedHistory.forEach(purchase => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';

            const date = new Date(parseInt(purchase.timestamp) * 1000).toLocaleString();
            const providerAddress = purchase.provider.toLowerCase();
            const shortAddress = `${providerAddress.substring(0, 6)}...${providerAddress.substring(38)}`;

            row.innerHTML = `
                <td class="py-3 px-4">${date}</td>
                <td class="py-3 px-4">${shortAddress}</td>
                <td class="py-3 px-4">${purchase.energyType}</td>
                <td class="py-3 px-4">${purchase.amount} kWh</td>
                <td class="py-3 px-4">${web3.utils.fromWei(purchase.totalPrice.toString(), 'ether')} ETH</td>
            `;

            tableBody.appendChild(row);
        });

        // Добавляем сообщение, если история пуста
        if (sortedHistory.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="py-4 px-4 text-center text-gray-500">
                    No purchase history available
                </td>
            `;
            tableBody.appendChild(emptyRow);
        }
    } catch (error) {
        console.error('Error loading purchase history:', error);
        // Показываем ошибку в таблице
        const tableBody = document.getElementById('purchaseHistory');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-4 px-4 text-center text-red-500">
                        Error loading purchase history. Please try again later.
                    </td>
                </tr>
            `;
        }
    }
}

if (window.ethereum) {
    contract.events.EnergyOutputUpdated()
        .on('data', async (event) => {
            if (event.returnValues.provider.toLowerCase() === userAccount.toLowerCase()) {
                const newOutput = event.returnValues.newOutput;
                document.getElementById('currentOutput').textContent = `${newOutput} kWh`;
                updateEnergyChart(newOutput);
            }
        })
        .on('error', console.error);
}

if (window.ethereum) {
    contract.events.EnergyPurchased()
        .on('data', async (event) => {
            if (event.returnValues.consumer.toLowerCase() === userAccount.toLowerCase()) {
                await loadPurchaseHistory();
            }
        })
        .on('error', console.error);
}