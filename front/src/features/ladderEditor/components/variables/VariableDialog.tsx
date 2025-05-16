import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";

function VariableDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="btn">Add Variable</DialogTrigger>
            <DialogOverlay />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Variable</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" className="input" />
                    <label htmlFor="type">Type</label>
                    <select id="type" className="select">
                        <option value="int">Integer</option>
                        <option value="float">Float</option>
                        <option value="string">String</option>
                    </select>
                    <label htmlFor="initial">Initial Value</label>
                    <input type="number" id="initial" className="input" />
                </div>
                <DialogClose className="btn mt-4">Add</DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default VariableDialog