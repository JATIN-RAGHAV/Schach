import { useEffect, useRef } from "react";

export const MousePieceDraggalbe = ({Piece,size}:{Piece:React.FC<{size: number;}> | null,size:number}) => {
    // Store the mouse positions in state to update to the right place
    const pieceRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {

        // Handler to update the mouse positions
        const handleMouseMove = (ev:MouseEvent)=>{
            const x = ev.clientX;
            const y = ev.clientY;
            if(pieceRef.current != null){
                pieceRef.current.style.left = `${x}px`;
                pieceRef.current.style.top = `${y}px`;
            }
        }

        // Add an event listener to mouse moving
        document.addEventListener('mousemove',handleMouseMove);

        // Remove even listener on page end
        return () => {
            document.removeEventListener('mousemove',handleMouseMove);
        }
        
    })


    if(Piece != null){
        return <span ref={pieceRef} className={`fixed top-0 left-0 translate-x-[-50%] translate-y-[-50%]`} >
        <Piece size={size} />
        </span>
    }
    else{
        return <></>
    }
}
