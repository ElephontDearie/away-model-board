"use client";
import { Button, Dropdown } from "react-bootstrap"
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


export const SprintList = () => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Past Sprints
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export const BacklogNavigation = () => {
    const router = useRouter();

    return (
        <Button onClick={() => router.push("/backlog")}>
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

