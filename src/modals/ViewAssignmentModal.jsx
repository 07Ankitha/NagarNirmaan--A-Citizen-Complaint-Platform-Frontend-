import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 50, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    background-color: #f0f8ff;
    padding: 40px;
    border-radius: 12px;
    width: 550px;
    box-shadow: 0 12px 30px rgba(0, 0, 80, 0.4);
`;

const Title = styled.h2`
    color: #003366;
    margin-bottom: 25px;
    text-align: center;
    font-size: 24px;
`;

const DetailItem = styled.div`
    margin-bottom: 15px;
    color: #003366;
    font-size: 16px;

    strong {
        font-weight: bold;
        margin-right: 5px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;

    button {
        padding: 10px 15px;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        font-size: 15px;
        background-color: #e0f0ff;
        color: #003366;

        &:hover {
            background-color: #cce6ff;
        }
    }
`;

const ViewAssignmentModal = ({ show, onClose, assignment }) => {
    if (!show || !assignment) return null;

    return (
        <ModalBackground>
            <ModalContainer>
                <Title>Assignment Details</Title>
                <DetailItem>
                    <strong>Organization Name:</strong> {assignment.organization.name}
                </DetailItem>
                <DetailItem>
                    <strong>Organization City:</strong> {assignment.organization.city.name}
                </DetailItem>
                <DetailItem>
                    <strong>Organization Category:</strong> {assignment.organization.category.name}
                </DetailItem>
                <DetailItem>
                    <strong>Start Date:</strong> {assignment.startDate}
                </DetailItem>
                <DetailItem>
                    <strong>End Date:</strong> {assignment.endDate}
                </DetailItem>
                <DetailItem>
                    <strong>Assigned At:</strong> {new Date(assignment.assignedAt).toLocaleString()}
                </DetailItem>
                <ButtonGroup>
                    <button onClick={onClose}>Close</button>
                </ButtonGroup>
            </ModalContainer>
        </ModalBackground>
    );
};

export default ViewAssignmentModal;