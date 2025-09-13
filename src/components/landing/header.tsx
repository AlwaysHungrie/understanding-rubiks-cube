import { ControlContainer } from "../common/controlContainer";
import { MessageActions } from "../common/messageActions";
import { PrimaryButton } from "../common/primaryButton";
import { LockIcon } from "lucide-react";

export const Header = () => {
  return (
    <>
      <div className="w-full relative h-8">
        <ControlContainer className="absolute top-0 left-0">
          <div className="text-white">
            Estimated Time: <span className="font-bold">90 minutes</span>
          </div>
        </ControlContainer>

        <MessageActions
          message="Finish all the steps of the guide to unlock this action."
          className="absolute top-0 right-0"
          actions={
            <PrimaryButton disabled className="gap-2">
              Solve Now
              <LockIcon className="w-4 h-4" />
            </PrimaryButton>
          }
        />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center mx-auto">
        <div className="font-oswald font-bold text-6xl">
          Thinking Rubik's Cube
        </div>
        <div className="text-xl">
          Solve the Rubik's Cube using only logical reasoning
        </div>
      </div>
    </>
  );
};
