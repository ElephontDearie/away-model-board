"use client";
import { Badge, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Image from "next/image";
import { useAuthContext } from "../context/AuthContext";


function AboutInfoBox() {
    const {user, isAdmin} = useAuthContext()
    return (
        <section className="board text-center my-5 py-5">
            <Card bg="info" text="white" className="info-box">
                <Card.Body className="text-black">
                    <Card.Title as="h1" className="text-white">About Away Team Tracker</Card.Title>
                    
                    <div className="mt-4 fw-bold"> 
                        <div>This site was created to track the progress of sprint tasks while working in the Away model framework.
                        This is where a team develops and works on another teams&apos;s codebase without owning any piece.
                        </div>
                        <div>This development team is called the Away team and the owning team is known as the Host team.</div>
                        <div>
                            Since code merge necessarily requires approval from both teams, an extra sprint column named 
                            <Badge className="ms-1 bg-success">In Peer Review</Badge> is used 
                            to track where collaboration and escalation is required to ensure sprint progress.
                        </div>
                    </div>

                    <Card.Subtitle as="h2" className="mt-5 mb-4">Navigation</Card.Subtitle>
                        <div>
                            <div><Badge>Backlog</Badge>: Here all the tasks in all sprints are viewable. New tasks can also be created here.</div>
                            <div><Badge>View Sprints</Badge>: This lists all the sprints created through this website. It also features a <Badge>See extended sprint 
                                    detail</Badge> menu item which allows actions like closing or starting sprint where possible.</div>
                            <div><Badge>Home</Badge>: Clicking Home or the site logo intentionally directs to an active sprint or to a list of sprints 
                                    conducted through the site.</div>
                        </div>

                    <Card.Subtitle as="h2" className="mt-5 mb-4">FAQs</Card.Subtitle>
                        <ListGroup>
                            <ListGroupItem>
                                <div>
                                    <span><b><i>How do I delete a task?</i></b></span>
                                    <p>Only an Administrator is authorised to delete sprint tasks. Please contact your manager to 
                                    find this point of contact or ask for an increase to your access level.</p>
                                </div>
                                </ListGroupItem>
                        </ListGroup>
                        
                </Card.Body>
            </Card>
             <Image
                src="/sprintLogo.svg"
                alt="board-logo"
                width={200}
                height={200}
                priority={true}
            />
        </section>
        
    )
}

export default AboutInfoBox;