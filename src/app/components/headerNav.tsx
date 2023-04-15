"use client";
import { Button, Dropdown } from "react-bootstrap"
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Sprint } from "@prisma/client";
import { fetchSprints } from "../handlers/sprint";
import { SprintBanner } from "./sprint";


export const SprintList = () => {
    const { user } = useAuthContext();
    const [sprints, setSprints] = useState<Sprint[]>();
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            
            if (response.status == 500) {
                if (typeof sprints == "string") {
                    setHasError(true);
                    console.log(sprints);
                } else if (sprints instanceof Error) {
                    console.log(sprints.message)
                }
            } else {
                setSprints(sprints)
            }
            
        } 
        fetchData().catch(error => console.log(error));
    }, [sprints])
        


    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="sprint-dropdown" disabled={!user || hasError}>
                View Sprints
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/sprint">See extended sprint detail</Dropdown.Item>
                {sprints && sprints.map(sprint => 
                        <Dropdown.Item href={`/sprint/${sprint.id}`} key={sprint.id}>
                            <SprintBanner sprint={sprint}/>
                        </Dropdown.Item>

                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export const BacklogNavigation = () => {
    const { user } = useAuthContext();
    return (
        <Link href="/backlog" passHref>
            <Button disabled={!user}>
                Backlog
            </Button> 
        </Link>
        
    )
}

export const LogoImage = () => (
    <Image
        src="/sprintLogo.svg"
        alt="board-logo"
        width={200}
        height={100}
        priority={true}
    />        
)

