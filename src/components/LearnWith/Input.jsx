import { useState, useEffect } from "react";
import { useMutation } from "../../lib/apollo";
import { useQuery } from "@apollo/client";
import LearningMomentContainer from "./LearningMomentContainer";
import { ADD_LEARNING_MOMENT, GET_USERS } from "../../lib/graphql";

const Input = ({ learningBitId }) => {
  const [value, setValue] = useState("");
  const [learningMoment, setLearningMoment] = useState(null);
  const { loading, error, data } = useQuery(GET_USERS);
  const user = data?.users[0];

  useEffect(() => {
    if (user) {
      const userLearningMoment = user.learningMoments.find(
        (learningMoment) => learningMoment.learningBitId === learningBitId
      );
      if (userLearningMoment) {
        setLearningMoment(userLearningMoment);
      }
    }
  }, [user, learningBitId]);

  const {
    load: addLearningMoment,
    loading: addLearningMomentLoading,
    error: addLearningMomentError,
  } = useMutation(ADD_LEARNING_MOMENT, {
    onCompleted: (data) => {
      // TODO - show alert/toast
      console.log("Learning moment saved ", data);
      return;
    },
    onError: (errorContinueLevel) => {
      // TODO - show alert/toast
      console.log("Learning moment save error :(", errorContinueLevel);
      return;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLearningMoment({
      variables: {
        userId: user.id,
        learningBitId: learningBitId,
        moment: value,
        type: "reflection",
      },
    });
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold tracking-tight">
        Learning moment
      </h2>
      {learningMoment ? (
        <LearningMomentContainer user={user} learningMoment={learningMoment} />
      ) : (
        <form action="#" className="space-y-8" onSubmit={handleSubmit}>
          <div className="relative text-xl border border-gray-300 rounded-lg shadow-sm overflow-hidden group focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <div className="p-6">
              <label htmlFor="description" className="sr-only">
                Learning moment input
              </label>
              <textarea
                rows={2}
                name="description"
                id="description"
                className="textarea textarea-ghost w-full text-xl"
                placeholder="I learned..."
                defaultValue={""}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="bottom-0 inset-x-px">
              <div className="border-t border-gray-200 px-2 py-3 flex items-center justify-end space-x-3 sm:px-3 group-focus-within:border-indigo-500 group-focus-within:ring-1 group-focus-within:ring-indigo-500">
                <div className="">
                  {!loading && user ? (
                    <button
                      type="submit"
                      className={`btn btn-primary btn-md ${
                        addLearningMomentLoading && "loading"
                      }`}
                    >
                      {!addLearningMomentLoading
                        ? "Mint your learning moment"
                        : "Minting"}
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-md">
                      Log-in to mint your learning moment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Input;
