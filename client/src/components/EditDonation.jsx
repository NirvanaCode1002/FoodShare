
function EditDonation({ editingDonation, handleUpdateDonation, setEditingDonation }) {
    if (!editingDonation) return null

    return (
        <div className="modal-overlay">
            <form className="edit-modal" onSubmit={handleUpdateDonation}>
                <h3>Edit Donation</h3>

                <div className="edit-row">
                    <label>Quantity:</label>
                    <input
                        name="quantity"
                        type="number"
                        min="0.1"
                        step="any"
                        defaultValue={editingDonation.quantity}
                        required
                    />
                </div>

                <div className="edit-row">
                    <label>Unit:</label>
                    <select name="unit" defaultValue={editingDonation.unit} required>
                        <option value="kg">Kg</option>
                        <option value="grams">Grams</option>
                        <option value="litres">Litres</option>
                        <option value="packets">Packets</option>
                        <option value="pieces">Pieces</option>
                        <option value="plates">Plates</option>
                    </select>
                </div>

                <div className="edit-row">
                    <label>Location:</label>
                    <input
                        name="location"
                        type="text"
                        defaultValue={editingDonation.location}
                        required
                    />
                </div>

                <div className="edit-row">
                    <label>Expiry Date:</label>
                    <input
                        name="expiryTime"
                        type="date"
                        defaultValue={
                            editingDonation.expiryTime
                                ? new Date(editingDonation.expiryTime).toISOString().slice(0, 10)
                                : ''
                        }
                    />
                </div>

                <div className="modal-buttons">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditingDonation(null)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditDonation
