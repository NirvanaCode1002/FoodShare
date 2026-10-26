
import DonationCard from './DonationCard'

function AvailableFood({
    donations,
    currentUser,
    searchText,
    setSearchText,
    locationFilter,
    setLocationFilter,
    foodTypeFilter,
    setFoodTypeFilter,
    getExpiryStatus,
    handleEdit,
    handleDelete
}) {
    const filteredDonations = donations.filter((donation) => {
        const search = searchText.trim().toLowerCase()
        const locationSearch = locationFilter.trim().toLowerCase()

        const matchesSearch =
            (donation.foodName || '').toLowerCase().includes(search) ||
            (donation.organizationName || '').toLowerCase().includes(search)

        const matchesLocation =
            (donation.location || '').toLowerCase().includes(locationSearch)

        return (
            matchesSearch &&
            matchesLocation &&
            (foodTypeFilter === 'All' || donation.foodType === foodTypeFilter)
        )
    })

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <h3 className="mb-5 text-2xl font-bold text-gray-800">
                Available Donations
            </h3>

            <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
                <input
                    type="text"
                    placeholder="Search food or organisation..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                />

                <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                />

                <div>
                    <label className="mb-1 block font-medium">Food Type</label>
                    <select
                        value={foodTypeFilter}
                        onChange={(event) => setFoodTypeFilter(event.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                        <option value="All">All Food Types</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>

                <p className="text-sm text-gray-600 sm:col-span-2">
                    Showing {filteredDonations.length} of {donations.length} donations
                </p>

                <button
                    type="button"
                    onClick={() => {
                        setSearchText('')
                        setLocationFilter('')
                        setFoodTypeFilter('All')
                    }}
                    className="w-fit rounded-md border border-gray-300 bg-white px-4 py-2"
                >
                    Clear Filters
                </button>
            </div>

            {filteredDonations.length === 0 ? (
                <p className="rounded-lg bg-gray-50 p-5 text-gray-600">
                    No matching donations found.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredDonations.map((donation) => (
                        <DonationCard
                            key={donation.id}
                            donation={donation}
                            currentUser={currentUser}
                            getExpiryStatus={getExpiryStatus}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AvailableFood
