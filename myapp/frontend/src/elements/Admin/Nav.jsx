function Nav(){
    return (
        <div>
            <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold">
                    Report admin
                    </div>

                    {/* Menu */}
                    <ul className="flex space-x-6">
                    <li>
                        <a href="/admin" className="hover:text-gray-200">Officers</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-gray-200">Local People</a>
                    </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Nav;