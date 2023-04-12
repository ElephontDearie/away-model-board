"use client";
import { Dispatch, RefAttributes, SetStateAction, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { ErrorModal, SuccessModal } from "./userInfo";
import { Badge, Button, ListGroup, ListGroupItem, Modal, Overlay, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { createSprint, fetchSprints, updateSprint } from "../handlers/sprint";
import SprintBoard from "./board";
import { isAdminUser } from "./auth";
import { Sprint } from "@prisma/client";
import "../sass/header.scss";
import "../sass/board.scss";
import Board from "../sprint/[id]/page";
import { useRouter } from "next/navigation";



export enum SprintStatus {
    'Pending',
    'Active',
    'Complete'
}

type InputSprint = {
    sprintId: string;
    title: string;
    status: string;
    goal: string;
    startDate: string;
    endDate?: string;
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
                {!isPending && 
                    <Button size="sm" onClick={() => availableSprintAction()} disabled={disabledArgs()}
                    className={statusColour(sprint.status)}>{getSprintActionLabel()}</Button>
                }
                {isPending &&
                    <OverlayTrigger placement="left" 
                    delay={{ show: 250, hide: 400 }}
                    // show={disabledArgs()}
                    // trigger="hover"
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
        <ListGroupItem key={sprint.id} className={"flex-fill clickable " + getBannerColour()} onClick={() => router.push(`sprint/${sprint.id}`)}>
            <span className={"me-5 align-items-center"}>{sprint.title}</span>
            <Badge className={statusColour(sprint.status) + " me-5 align-items-center"}>{sprint.status}</Badge>
        </ListGroupItem>

    )
}

export const ShowSprintList = ({sprints}: {sprints: Sprint[] | undefined}) => {
    const [hasActiveSprint, setHasActiveSprint] = useState<boolean>(true);

    useEffect(() => {
        const hasActive = sprints && sprints.find(sprint => sprint.status == SprintStatus[SprintStatus.Active]);
        !!hasActive && setHasActiveSprint(true);
    }, [sprints])
    
    return (
        <div>
            <h2 className={"text-center text-muted mt-3 mb-4"}>All Sprints</h2>
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

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            setSprints(sprints)
            const activeSprint = sprints && sprints.find(s => s.status == SprintStatus[SprintStatus["Active"]]);
            activeSprint && setActiveSprint(activeSprint);
            activeSprint && router.push(`/sprint/${activeSprint.id}`);
            
            // setLoading(false);
        } 
        fetchData().catch(error => console.log(error));
        
    }, [sprints, activeSprint]);
    
    return (
        <>
            {!activeSprint && (
                <section>
                    <CreateSprintButton />
                    <ShowSprintList sprints={sprints} />
                </section>

            )}
        </>
    )
}

export const CreateSprintButton = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <Button className="btn bg-warning text-black" onClick={() => setShowModal(true)}>
                Create a Sprint
            </Button>
            <CreateFirstSprint showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}

type CreateProps = {
    showModal: boolean; 
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CreateFirstSprint = (props: CreateProps) => {

    return (
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
          {/* <Button variant="primary" onClick={() => crudOperation()}>Confirm</Button> */}
        </Modal.Footer>
      </Modal>
    )
}

const completeSprint = async (sprintId: number) => {
    const endDate = new Date();
    const status = SprintStatus[SprintStatus.Complete]
    return updateSprint(sprintId, status, endDate);
    // const res = await fetch(`/api/sprints/${sprintId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         endDate,
    //         status
    //     }),
    //   });
    //   console.log(res)
  
        // if (res.status == 500) {
        //   const errorMessage = await res.json();
        //   setOutcomeMessage(errorMessage)
        //   setShowError(true);
        //   setTimeout(() => {
        //     setShowError(false)
        //   }, 5000)
        // } else {
        //   setOutcomeMessage(`Task named "${title}" was successfully added to the sprint!`)
        //   setShowSuccess(true);
        //   setTimeout(() => {
        //     setShowSuccess(false)
        //   }, 5000)
        // }

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
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required />
        <input type="text" name="goal" placeholder="Goal" required />
        <button type="submit">Create Sprint</button>
      </form>
  
      <ErrorModal setShowMessage={setShowError} showMessage={showError} message={outcomeMessage}/>
      <SuccessModal setShowMessage={setShowSuccess} showMessage={showSuccess} message={outcomeMessage}/>
      
    </>
    )
  }

