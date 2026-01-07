
import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const buttonStyles = cva(["hover:bg-secondary-hover", "transition-colors"], {
    variants: {
        variant: {
            default: ["bg-secondary", "hover:bg-secondary-hover"],
            main: ["w-80 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  ", " hover:bg-red-700"],
            secondary: ["w-80 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white   focus:outline-none ring-1 focus:ring-offset-2 ring-red-500  ", "hover:ring-red-700 hover:text-red-700 hover:bg-red-100"],
           
            ghost: ["hover:bg-gray-100"]
        },
        size: {
            default: ["rounded", "py-2", "px-4"],
            icon: [
                "p-2.5",
                "rounded-full",
                "items-center",
                "justify-center",
                "flex",
                "h-12",
                "w-12",

            ]
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
})


export function Button({ variant, size, className, ...props }) {
    return <button {...props} className={twMerge(buttonStyles({ variant, size }), className)} />;
}