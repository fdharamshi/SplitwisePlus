import React from 'react';
import './groups.css';
import {useSelector} from "react-redux";
import {selectAllGroups} from "../store/selectors/selectors";

export const GroupBalances = () => {
    const localUserId = JSON.parse(window.localStorage.getItem("user"))['user']['id'].toString();
    const groupsData = useSelector(selectAllGroups);

    const calculateUserBalance = (members, userId) => {
        return members.reduce((acc, member) => {
            if (member.id.toString() === userId) {
                // Sum all balances for the user
                const userBalances = member.balance.reduce((total, balance) => {
                    return total + parseFloat(balance.amount);
                }, 0);
                return acc + userBalances;
            }
            return acc;
        }, 0);
    };

    // TODO: Add Sorting

    return (
        <div className="group-balances-container">
            {groupsData.map((group) => [calculateUserBalance(group.members, localUserId), group])
                .filter(data => Math.abs(data[0]) > 0)
                .map(data => {
                    const userBalance = data[0];
                    const group = data[1];
                    const balanceDisplay = userBalance.toFixed(2);
                    const isOwed = userBalance > 0;
                    const balanceClassName = isOwed ? 'owed' : 'owes';
                    const owedDisplay = isOwed
                        ? `you are owed $${balanceDisplay}`
                        : `you owe $${Math.abs(balanceDisplay)}`;

                    return (
                        <div key={group.id} className="group-balance">
                            <div className="group-info">
                                <img src={group.avatar.small} alt={group.name}/>
                                <div className="group-name">{group.name}</div>
                            </div>
                            <div className={`group-balance-amount ${balanceClassName}`}>{owedDisplay}</div>
                        </div>
                    );
                })}
            {/*{groupsData.map((group) => {*/}
            {/*    const userBalance = calculateUserBalance(group.members, localUserId);*/}
            {/*    */}
            {/*})}*/}
        </div>
    );
};