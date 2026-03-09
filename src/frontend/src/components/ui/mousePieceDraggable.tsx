import { useEffect, useState } from "react";

export const MousePieceDraggalbe = ({Piece}:{Piece:React.FC<{size: number;}> | null}) => {
    // Store the mouse positions in state to update to the right place
    const [mouseX,setMouseX] = useState<number>(10);
    const [mouseY,setMouseY] = useState<number>(10);

    useEffect(() => {

        // Handler to update the mouse positions
        const handleMouseMove = (ev:MouseEvent)=>{
            setMouseX(ev.clientX)
            setMouseY(ev.clientY)
        }

        // Add an event listener to mouse moving
        document.addEventListener('mousemove',handleMouseMove);


        // Remove even listener on page end
        return () => {
            document.removeEventListener('mousemove',handleMouseMove);
        }
        
    })


    if(Piece != null){
        return <span className={`fixed`} style={{top:(mouseY-15),left:(mouseX-20)}}>
        <Piece size={45} />
        </span>
    }
    else{
        return <></>
    }
}
