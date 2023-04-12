import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { ErrorModal, SuccessModal } from "./userInfo";
import { Badge, Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { createSprint, fetchSprints, updateSprint } from "../handlers/sprint";
import SprintBoard from "./board";
import { isAdminUser } from "./auth";
import { Sprint } from "@prisma/client";
import "../sass/header.scss"



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

export const ActiveSprintBanner = ({sprint}: {sprint: Sprint}) => {
    return (
        <ListGroup className={"text-center"}>
            <ListGroupItem key={sprint.id}>
                <span className={"me-5"}>{sprint.title}</span>
                <Badge className={statusColour(sprint.status) + " me-5"}>{sprint.status}</Badge>
            </ListGroupItem>
        </ListGroup>

    )
}

const ShowSprintList = ({sprints, hasActiveSprint}: {sprints: Sprint[] | undefined, hasActiveSprint: boolean}) => {
    const activateSprint = async (sprintId: number) => {
        return await updateSprint(sprintId, SprintStatus[SprintStatus.Active])
    }
    return (
        <div>
            <h2 className={"text-center text-white"}>All Sprints</h2>
            <ListGroup className={"text-center"}>
                {sprints && sprints.map(sprint => 
                <ListGroupItem key={sprint.id}>
                    <span className={"me-5"}>{sprint.title}</span>
                    <Badge className={statusColour(sprint.status) + " me-5"}>{sprint.status}</Badge>
                    {!hasActiveSprint && sprint.status == SprintStatus[SprintStatus.Pending] && 
                        <Button onClick={() => activateSprint(sprint.id)} className={"sign-up text-dark me-5"}>
                            Start Sprint
                        </Button>}
                </ListGroupItem>)}
            </ListGroup>
        </div>

    )
}

export const SprintView = ({isAdmin}: {isAdmin: boolean}) => {
    const user = useAuthContext();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [sprints, setSprints] = useState<Sprint[]>();
    const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSprints();
            const sprints: Sprint[] = await response.json();
            setSprints(sprints)
            const activeSprint = sprints && sprints.find(s => s.status == SprintStatus[SprintStatus["Active"]]);
            activeSprint && setActiveSprint(activeSprint);
            // console.log(sprints);
            
            // setTasks(tasks);
            // setLoading(false);
        } 
        fetchData().catch(error => console.log(error));
        
    }, [activeSprint]);
    
    return (
        <>
            {!activeSprint && (
                <section>
                    <Button className="btn text-white" onClick={() => setShowModal(true)}>
                        Create a Sprint
                    </Button>
                    <CreateFirstSprint showModal={showModal} setShowModal={setShowModal} />
                    <ShowSprintList sprints={sprints} hasActiveSprint={!!activeSprint}/>
                </section>

            )}
            
            {activeSprint && <SprintBoard isAdmin={isAdmin} sprint={activeSprint} />}

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

const completeSprint = async (sprintId: string) => {
    const endDate = new Date();
    const res = await fetch(`/api/sprints/${sprintId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            endDate
        }),
      });
      console.log(res)
  
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

