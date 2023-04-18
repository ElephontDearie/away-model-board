import React, { useState } from 'react'
import { TaskItem } from '@/app/components/task'
import { Task } from '@prisma/client'


const wrappedTaskItem = () => {
    const testTask: Task = {
        id: 100,
        sprintId: 10,
        title: 'test-task',
        description: 'test-task description',
        status: 'To Do',
        authorId: 'tester'
      }
      
    const TaskItemWrapper = (props: {
        isAdmin: boolean
    }) => {
        const [draggedIssue, setDraggedIssue] = useState<Task | null>(null);
        return <TaskItem task={testTask} 
            setDraggedIssue={setDraggedIssue} 
            isAdmin={props.isAdmin || false} />
    }
    return TaskItemWrapper
}

describe('<TaskItem />', () => {
    it('should render the Task componenet with correct content', () => {
        const TaskWrapper = wrappedTaskItem()
        cy.mount(<TaskWrapper isAdmin={false}/>)
        cy.get('.card-title').should('have.text', '#100test-task')
        cy.get('.card-subtitle').should('have.text', 'test-task description')
        
        // Only renders Edit for regular users 
        cy.get('section > button').should('have.text', 'Edit')
    })

    it('should render the Task componenet with correct content when admin user', () => {
        const TaskWrapper = wrappedTaskItem()
        cy.mount(<TaskWrapper isAdmin={true}/>)
        cy.get('.card-title').should('have.text', '#100test-task')
        cy.get('.card-subtitle').should('have.text', 'test-task description')

        // Renders Edit and Delete for admin users
        cy.get('section > button:first').should('have.text', 'Edit')
        cy.get('section > button:last').should('have.text', 'Delete')

    })
})