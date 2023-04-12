"use client";
import { Button, Card, Dropdown, Modal } from "react-bootstrap"
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Sprint } from "@prisma/client";
import { fetchSprints } from "../handlers/sprint";
import { CreateSprintButton, SprintBanner, SprintStatus } from "./sprint";


export const SprintList = () => {
    const { user, isAdmin } = useAuthContext();
    const [sprints, setSprints] = useState<Sprint[]>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            setSprints(sprints)
            // setLoading(false);
        } 
        fetchData().catch(error => console.log(error));
    }, [sprints])
        


    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="sprint-dropdown" disabled={!user}>
                View Sprints
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/sprint">See extended sprint detail</Dropdown.Item>
                {sprints && sprints.map(sprint => 
                        <Dropdown.Item href={`/sprint/${sprint.id}`} key={sprint.id}>
                            <SprintBanner sprint={sprint}/>
                            {/* sprint.title */}
                        </Dropdown.Item>

                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export const BacklogNavigation = () => {
    const user = useAuthContext();
    const router = useRouter();

    return (
        <Button disabled={!user} onClick={() => router.push("/backlog")}>
            Backlog
        </Button> 
    )
}

export const LogoNavigation = () => {
    const router = useRouter();
    return (

        <Image
            src="/sprintLogo.svg"
            alt="board-logo"
            width={200}
            height={100}
            priority={true}
            onClick={() => router.push("/")}
        />

    )
}
