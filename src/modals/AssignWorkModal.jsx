import React, { useState } from 'react';
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

const FormField = styled.div`
    margin-bottom: 18px;

    label {
        display: block;
        margin-bottom: 8px;
        color: #003366;
        font-weight: 600;
        font-size: 14px;
    }

    input,
    select {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #0077cc;
        border-radius: 6px;
        background-color: #ffffff;
        color: #003366;
        font-size: 15px;
        box-shadow: 0 4px 8px rgba(0, 119, 204, 0.1);
        transition: 0.2s ease-in-out;

        &:focus {
            outline: none;
            border-color: #005fa3;
            box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.2);
        }
    }

    input:disabled {
        background-color: #f5f9ff;
        color: #666;
        border-color: #aac;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
        background-color: #0077cc;
        border-radius: 50%;
        padding: 5px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    button {
        padding: 12px 18px;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        width: 48%;
        font-size: 15px;
    }

    .assign-btn {
        background-color: #0077cc;
        color: white;
        transition: 0.2s;

        &:hover {
            background-color: #005fa3;
        }
    }

    .cancel-btn {
        background-color: #e0f0ff;
        color: #003366;

        &:hover {
            background-color: #cce6ff;
        }
    }
`;

const AssignWorkModal = ({ show, onClose, onAssign, category, city, organizations }) => {
    const [selectedOrg, setSelectedOrg] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!show) return null;

    const handleSubmit = () => {
        if (selectedOrg && startDate && endDate) {
            onAssign({
                organization: selectedOrg,
                startDate,
                endDate,
            });
            onClose();
        } else {
            alert('Please fill all fields');
        }
    };

    return (
        <ModalBackground>
            <ModalContainer>
                <Title>Assign Work</Title>
                <FormField>
                    <label>Category</label>
                    <input type="text" value={category} disabled />
                </FormField>
                <FormField>
                    <label>City</label>
                    <input type="text" value={city} disabled />
                </FormField>
                <FormField>
                    <label>Select Organization</label>
                    <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)}>
                        <option value="">-- Choose --</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </FormField>
                <FormField>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </FormField>
                <FormField>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </FormField>
                <ButtonGroup>
                    <button className="assign-btn" onClick={handleSubmit}>Assign</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </ButtonGroup>
            </ModalContainer>
        </ModalBackground>
    );
};

export default AssignWorkModal;