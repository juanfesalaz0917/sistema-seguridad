import React, { useState, useEffect } from "react";
import PropertyComponent from "../components/property";
    const Demo: React.FC = () => {
        //Ciclo de vida
        useEffect(() => {
            //Programe lo que necesita que se haga al momento de cargar la página
            console.log("Componente montado");
            return () => {
                //Programe lo que necesita que se haga al momento de salir de la página
                console.log("Componente desmontado");
            }
        }, []);

        //Variables reactivas
        let [name, setName] = useState<string>("Felipe");
        
        const theChange=(e:any) => setName(e.target.value)

        return <><div>
            <h1>Hola {name}</h1>
            <input type="text" value={name} onChange={theChange} />

        </div><PropertyComponent name="Baltic Avenue" color="brown" price={60} rent={[4, 20, 60, 180, 320, 450]} />
        <PropertyComponent name="Oriental Avenue" color="lightblue" price={100} rent={[6, 30, 90, 270, 400, 550]} />
        <PropertyComponent name="Vermont Avenue" color="lightblue" price={100} rent={[6, 30, 90, 270, 400, 550]} />
        <PropertyComponent name="Connecticut Avenue" color="lightblue" price={120} rent={[8, 40, 100, 300, 450, 600]} /></>
    }

    
    export default Demo;