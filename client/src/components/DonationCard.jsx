
function DonationCard({ donation, currentUser, getExpiryStatus, handleEdit, handleDelete }) {
    const status = getExpiryStatus(donation.expiryTime)

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800">
                {donation.foodName} ({donation.foodType || 'Food'})
            </h4>

            <p className="mb-4 text-gray-600">
                Donated by: {donation.organizationName || 'Not specified'}
            </p>

            <p className="mb-4 text-gray-600">
                <strong>Contact Number:</strong> {donation.contactNumber || 'Not provided'}
            </p>

            {donation.foodImage && (
                <img
                    src={donation.foodImage}
                    alt={donation.foodName}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                />
            )}

            <p className="mb-4">
                <strong>Quantity:</strong> {donation.quantity} {donation.unit}
            </p>

            <p className="mb-4 break-words">
                <strong>Location:</strong> {donation.location}
            </p>

            <p className="mb-4">
                <strong>Expiry:</strong>{' '}
                {donation.expiryTime
                    ? new Date(donation.expiryTime).toLocaleDateString('en-IN')
                    : 'Not specified'}
            </p>

            <p className={`mb-4 font-medium ${status === 'Fresh'
                    ? 'text-green-700'
                    : status === 'Expiring Soon'
                        ? 'text-orange-600'
                        : status === 'Expired'
                            ? 'text-red-700'
                            : 'text-gray-500'
                }`}>
                Expiry Status: {status}
            </p>

            {currentUser.role === 'Donor' && (
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="rounded-md bg-green-700 px-4 py-2 text-white"
                        onClick={() => handleEdit(donation.id)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="rounded-md bg-red-600 px-4 py-2 text-white"
                        onClick={() => handleDelete(donation.id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default DonationCard
