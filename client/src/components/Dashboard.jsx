
function Dashboard({ currentUser, donations, getExpiryStatus }) {
    return (
        <div className="p-6">
            <h2 className="mb-2 text-2xl font-bold">
                FoodShare Dashboard
            </h2>

            <p className="mb-6">Welcome, {currentUser.name}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Donations</p>
                    <h3 className="mt-2 text-3xl font-bold">{donations.length}</h3>
                </div>

                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Fresh Food</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {donations.filter(d => getExpiryStatus(d.expiryTime) === 'Fresh').length}
                    </h3>
                </div>

                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Expiring Soon</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {donations.filter(d => getExpiryStatus(d.expiryTime) === 'Expiring Soon').length}
                    </h3>
                </div>

                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Expired Food</p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {donations.filter(d => getExpiryStatus(d.expiryTime) === 'Expired').length}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
