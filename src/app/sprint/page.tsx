"use client";
import { ShowSprintList, SprintStatus } from "../components/sprint";
import { Sprint } from "@prisma/client";
import { useState, useEffect } from "react";
import { fetchSprints } from "../handlers/sprint";

function SprintView () {
    // const { user, isAdmin } = useAuthContext();
    const [sprints, setSprints] = useState<Sprint[]>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            setSprints(sprints)
        } 
        fetchData().catch(error => console.log(error));
        
    }, [sprints]);
    
    return (
        <>
            <section>
                <ShowSprintList sprints={sprints} />
            </section>
        </>
    )
}

export default SprintView;
