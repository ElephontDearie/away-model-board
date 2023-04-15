"use client";
import { useRouter } from "next/navigation";
import { ShowSprintList, SprintStatus } from "../components/sprint";
import { Sprint } from "@prisma/client";
import { useState, useEffect } from "react";
import { fetchSprints } from "../handlers/sprint";

function SprintView () {
    // const { user, isAdmin } = useAuthContext();
    const [sprints, setSprints] = useState<Sprint[]>();
    // const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            setSprints(sprints)
            
            // setLoading(false);
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
