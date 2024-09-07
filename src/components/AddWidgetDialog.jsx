import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddWidgetDialog = ({ isOpen, onClose, onAddWidget, availableWidgets }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {availableWidgets.map((widget) => (
            <Button
              key={widget}
              onClick={() => onAddWidget(widget)}
              variant="outline"
              className="text-left"
            >
              {widget}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;