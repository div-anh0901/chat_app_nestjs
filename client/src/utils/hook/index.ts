import{useEffect}  from 'react'

export function useKeyDown(callback: (e: KeyboardEvent) => void, deps?: React.DependencyList | undefined) {
    useEffect(() => {
        window.addEventListener('keydown', callback);
        return () => {
            window.removeEventListener('keydown', callback);
        }

    }, deps);
}


export function useHangeclick(callback: (e: MouseEvent) => any, deps?: React.DependencyList | undefined) {
    useEffect((
        
    ) => {
        window.addEventListener('click', callback);
        return () => {
            window.removeEventListener('click', callback);
        }
    },deps)
}
