
function Navbar({ currentUser, setPage, setAuthMode, setAuthMessage, handleLogout }) {
    return (
        <>
            <header className="foodshare-header">
                <div className="foodshare-brand flex items-center gap-3">
                    <img
                        src="/foodshare-logo.png"
                        alt="FoodShare Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <h1 className="text-2xl font-bold text-white-800">
                        FoodShare
                    </h1>
                </div>
            </header>

            <nav className="foodshare-nav" >
                <button onClick={() => setPage('Home')}>
                    Home
                </button>

                {!currentUser && (
                    <button onClick={() => {
                        setAuthMode('login')
                        setAuthMessage('')
                        setPage('Login')
                    }}>
                        Login
                    </button>
                )}

                {currentUser && (
                    <>
                        <button onClick={() => setPage('Dashboard')}>
                            Dashboard
                        </button>

                        <button onClick={() => setPage('Available Food')}>
                            Available Food
                        </button>

                        {currentUser.role === 'Donor' && (
                            <button onClick={() => setPage('Add Donation')}>
                                Add Donation
                            </button>
                        )}

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </nav>
        </>
    )
}

export default Navbar