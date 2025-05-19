import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VariableForm from "./VariableForm";
import { useVariableStore } from "../../../shared/editor/stores/variableStore";

function VariableDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { editingVariable, setEditingVariable } = useVariableStore();

    useEffect(() => {
        if (editingVariable) {
            setIsDialogOpen(true);
        }
    }, [editingVariable]);

    const handleClose = () => {
        setIsDialogOpen(false);

        if (editingVariable) {
            setEditingVariable(null);
        }
    };

    const handleOpenchange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingVariable(null);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenchange}>
            <DialogTrigger asChild>
                <Button variant="default">Add Variable</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingVariable ? "Edit Variable" : "Add Variable"}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <VariableForm
                        existingVariable={editingVariable}
                        onSubmit={handleClose}
                    />
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default VariableDialog;