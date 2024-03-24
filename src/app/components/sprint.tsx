"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { ErrorModal, SuccessModal } from "./userInfo";
import { Badge, Button, Form, ListGroup, ListGroupItem, Modal, Overlay, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { createSprint, fetchSprints, updateSprint } from "../handlers/sprint";
import { Sprint } from "@prisma/client";
import { useRouter } from "next/navigation";
import { LoadingPage } from "./load";
import "../sass/header.scss";
import "../sass/board.scss";


export enum SprintStatus {
    'Pending',
    'Active',
    'Complete'
}

const statusColour = (status: string) => {
    if (status == SprintStatus[SprintStatus.Active]) return "bg-success"
    else if (status == SprintStatus[SprintStatus.Pending]) return "bg-primary"
    else return "bg-secondary"
}

export const SprintBanner = ({sprint}: {sprint: Sprint}) => {
    return (
        <ListGroup className={"text-center"}>
            <SingleSprintBanner sprint={sprint}/>
        </ListGroup>
    )
}

export const SprintBannerOnBoard = ({sprint, activeSprintExists}: {sprint: Sprint, activeSprintExists: boolean}) => {
    const isClosed = sprint.status == SprintStatus[SprintStatus.Complete];
    const isPending = sprint.status == SprintStatus[SprintStatus.Pending];
    const isActive = sprint.status == SprintStatus[SprintStatus.Active];    

    const activateSprint = async (sprintId: number) => {
        return await updateSprint(sprintId, SprintStatus[SprintStatus.Active])
    }

    const getSprintActionLabel = () => {
        if (isPending) {
            return "Start Sprint";
        } else if (isActive) {
            return "Complete Sprint";
        }
    }
    const availableSprintAction = () => {
        if (isPending) {
            activateSprint(sprint.id);
        } else if (isActive) {
            completeSprint(sprint.id);
        }
    }
    const disabledArgs = () => {
        if (isPending && activeSprintExists) {
            return true;
        }
        return false;
    }
    const tooltipWarning = (props: any) => (
            <Tooltip id="tooltip-active-exists-warning" {...props}>
                Active sprint must be completed before a new sprint can be started.
            </Tooltip>
    );
    
    return (
        <ListGroup horizontal className={"text-center d-flex flex-fill"}>
            <SingleSprintBanner sprint={sprint} />
            {!isClosed && <ListGroupItem>
                {!isPending || (isPending && !activeSprintExists) && 
                    <Button size="sm" onClick={() => availableSprintAction()} disabled={disabledArgs()}
                    className={statusColour(sprint.status)}>{getSprintActionLabel()}</Button>
                }
                {isPending && activeSprintExists &&
                    <OverlayTrigger placement="left" 
                    delay={{ show: 250, hide: 400 }}
                    overlay={tooltipWarning}>
                        <span className="d-inline-block">
                        <Button size="sm" onClick={() => availableSprintAction()} disabled={disabledArgs()}
                            style={{ pointerEvents: 'none' }}
                            className={statusColour(sprint.status)}>{getSprintActionLabel()}</Button>
                        </span>
                   
                </OverlayTrigger>
                }
                
            </ListGroupItem>}
        </ListGroup>

    )
}

const SingleSprintBanner = ({sprint}: {sprint: Sprint}) => {
    const router = useRouter();
    const getBannerColour = () => {
        if (sprint.status == SprintStatus[SprintStatus.Active]) {
            return "sprint-banner-active"
        } else if (sprint.status == SprintStatus[SprintStatus.Pending]) {
            return "sprint-banner-pending";
        } else {
            return "sprint-banner-complete"
        }
    }
    return (
        <ListGroupItem key={sprint.id} className={"flex-fill clickable " + getBannerColour()} onClick={() => router.push(`/sprint/${sprint.id}`)}>
            <span className={"me-5 align-items-center"}>{sprint.title}</span>
            <Badge className={statusColour(sprint.status) + " me-5 align-items-center"}>{sprint.status}</Badge>
        </ListGroupItem>

    )
}

export const ShowSprintList = ({sprints}: {sprints: Sprint[] | undefined}) => {
    const [hasActiveSprint, setHasActiveSprint] = useState<boolean>(false);

    useEffect(() => {
        const hasActive = sprints && sprints.find(sprint => sprint.status == SprintStatus[SprintStatus.Active]);
        !!hasActive && setHasActiveSprint(true);
    }, [sprints])
    
    return (
        <div>
            <h2 className={"text-center mt-3 mb-4"}>All Sprints</h2>
            <ListGroup className={"text-center"}>
                {sprints && sprints.map(sprint => 
                <ListGroupItem key={sprint.id}>

                    <SprintBannerOnBoard sprint={sprint} activeSprintExists={hasActiveSprint} />
 
                </ListGroupItem>)}
            </ListGroup>
        </div>

    )
}

export const SprintView = () => {
    const { user, isAdmin } = useAuthContext();
    const router = useRouter();
    const [sprints, setSprints] = useState<Sprint[]>();
    const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            if (response.status == 500) {
                setSprints(undefined);
                if (typeof sprints == "string") {                    
                    console.log(sprints);
                } else if (sprints instanceof Error) {
                    console.log(response)
                    console.log(sprints.message)
                }
            } else {
                setSprints(sprints)
                const activeSprint = sprints && sprints.find(s => s.status == SprintStatus[SprintStatus["Active"]]);
                activeSprint && setActiveSprint(activeSprint);
                activeSprint && router.push(`/sprint/${activeSprint.id}`);
            }

            activeSprint && router.push(`/sprint/${activeSprint.id}`);
            setLoading(false);
            
        } 
        fetchData().catch(error => console.log(error));
        
    }, [sprints, activeSprint]);
    
    return (
        <>
            {!user && router.push("/")}
            {loading && <LoadingPage />}
            {!activeSprint && !loading && (
                <ShowSprintList sprints={sprints} />

            )}
        </>
    )
}

export const CreateSprintButton = () => {
    const { user } = useAuthContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <Button className="btn bg-warning text-black" onClick={() => setShowModal(true)} disabled={!user}>
                Create a Sprint
            </Button>
            <CreateSprint showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}

type CreateProps = {
    showModal: boolean; 
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CreateSprint = (props: CreateProps) => (
    <Modal show={props.showModal} onHide={() => props.setShowModal(prev => false)} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
        <Modal.Title>Creating new Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddSprintForm />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => props.setShowModal(prev => false)}>
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
)


const completeSprint = async (sprintId: number) => {
    const endDate = new Date();
    const status = SprintStatus[SprintStatus.Complete]
    return updateSprint(sprintId, status, endDate);
}

export type CreateSprintArgs = {
    title: string;
    goal: string;
    status: string;
    startDate: string;
}

export const AddSprintForm = () => {
    const [showError, setShowError] = useState<boolean>(false);
    const[showSuccess, setShowSuccess] = useState<boolean>(false);
    const [outcomeMessage, setOutcomeMessage] = useState<string>('');
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setShowError(false);
      setShowSuccess(false)
      const formData = new FormData(event.currentTarget);
      const title = formData.get('title') as string;

      const goal = formData.get('goal') as string;
      const status = SprintStatus[SprintStatus["Pending"]]
      const startDate = new Date()
  
      const pendingSprint: CreateSprintArgs = {
        title,
        goal,
        status,
        startDate: `${startDate}`,
      } 
      const res = await createSprint(pendingSprint);
  
        if (res.status == 500) {
          const errorMessage = await res.json();
          setOutcomeMessage(errorMessage)
          setShowError(true);
          setTimeout(() => {
            setShowError(false)
          }, 5000)
        } else {
          setOutcomeMessage(`Sprint named "${title}" was successfully created!`)
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false)
          }, 5000)
        }
    };
  
    return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Sprint Title:</Form.Label>
            <Form.Control type='text' name='title' placeholder="Title" required/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Sprint Goal:</Form.Label>
            <Form.Control type='text' name='goal' placeholder="Goal" required/>
        </Form.Group>
        <Button type="submit">Create Sprint</Button>
      </Form>
  
      <ErrorModal setShowMessage={setShowError} showMessage={showError} message={outcomeMessage}/>
      <SuccessModal setShowMessage={setShowSuccess} showMessage={showSuccess} message={outcomeMessage}/>
      
    </>
    )
  }

