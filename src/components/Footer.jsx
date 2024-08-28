import React from 'react'

export const Footer = () => {
    return (
        <div>
            <footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
                <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024
                    </span>
                    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    
                        <li>
                            <a href="https://sthalin.vercel.app/" class="hover:underline me-4 md:me-6">Ver más proyectos</a>
                        </li>
                  
                        <li>
                            <a href="https://sthalin.vercel.app/" class="hover:underline">By Sthalin Rivera</a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}


