import React, { useState } from "react";
import "./AccountForm.css";

const AccountForm = () => {
    return (
        <form className="accountForm text-center">
            <h2 className="text-center mt-4 mb-5 accountHeader">Connect your accounts</h2>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="steamKey" className="form-label keyLabel">Steam Key</label>
                    <input type="text" className="form-control" id="steamKey" placeholder="Your Steam API Key" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="discordKey" className="form-label keyLabel">Discord Key</label>
                    <input type="text" className="form-control" id="discordKey" placeholder="Your Discord API Key" />
                </div>
            </div>
            <div className="text-center mt-3">
                <button type="submit" className="btn keyBtn">Save Keys</button>
            </div>
        </form>
    )
}

export default AccountForm;
