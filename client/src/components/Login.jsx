
function Login({ authMode, setAuthMode, authMessage, setAuthMessage, handleAuthSubmit }) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md rounded-xl bg-white p-7 shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-6">
                    {authMode === 'login' ? 'Login' : 'Create an Account'}
                </h2>

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                    {authMode === 'signup' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="font-medium">Full Name:</label>
                                <input id="name" name="name" type="text" required
                                    className="w-full box-border rounded-md border border-gray-300 px-3 py-2" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="role" className="font-medium">Account Type:</label>
                                <select id="role" name="role" defaultValue="Recipient" required
                                    className="w-full box-border rounded-md border border-gray-300 px-3 py-2">
                                    <option value="Donor">Donor</option>
                                    <option value="Recipient">Recipient</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium">Email:</label>
                        <input id="email" name="email" type="email" required
                            className="w-full box-border rounded-md border border-gray-300 px-3 py-2" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-medium">Password:</label>
                        <input id="password" name="password" type="password" minLength="8" required
                            className="w-full box-border rounded-md border border-gray-300 px-3 py-2" />
                    </div>

                    <div className="flex justify-center">
                        <button type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
                            {authMode === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {authMessage && <p>{authMessage}</p>}

                <div className="flex justify-center">
                    <p>
                        {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button type="button" onClick={() => {
                            setAuthMode(authMode === 'login' ? 'signup' : 'login')
                            setAuthMessage('')
                        }}>
                            {authMode === 'login' ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
