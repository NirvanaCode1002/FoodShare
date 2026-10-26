
function AddDonation({ handleSubmit, location, setLocation, getCurrentLocation }) {
    return (
        <div className="add-donation-page">
           

            <form className="add-donation-form" onSubmit={handleSubmit}>
                <div className="add-donation-field">
                    <label>Organization Name</label>
                    <input name="organizationName" required />
                </div>

                <div className="add-donation-field">
                    <label>Contact Number</label>
                    <input name="contactNumber" type="tel" required />
                </div>

                <div className="add-donation-field">
                    <label>Food Name</label>
                    <input name="foodName" required />
                </div>

                <div className="add-donation-field">
                    <label>Food Type</label>
                    <select name="foodType" required defaultValue="Veg">
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>

                <div className="add-donation-field">
                    <label>Food Image</label>
                    <input name="foodImage" type="file" accept="image/*" />
                </div>

                <div className="add-donation-field">
                    <label>Quantity</label>
                    <input name="quantity" type="number" min="1" required />
                </div>

                <div className="add-donation-field">
                    <label>Unit</label>
                    <select name="unit" required defaultValue="plates">
                        <option value="plates">Plates</option>
                        <option value="kg">Kg</option>
                        <option value="packets">Packets</option>
                    </select>
                </div>

                <div className="add-donation-field">
                    <label>Location</label>
                    <input
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="button" onClick={getCurrentLocation}>
                        Use Current Location
                    </button>
                </div>

                <div className="add-donation-field">
                    <label>Expiry Date</label>
                    <input name="expiryTime" type="date" required />
                </div>

                <button type="submit" className="add-donation-submit">
                    Add Donation
                </button>
            </form>
        </div>
    )
}

export default AddDonation
