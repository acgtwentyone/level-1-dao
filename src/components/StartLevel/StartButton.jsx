import { useMutation } from "../../lib/apollo";
import { ADD_USER_LEARNING_JOURNEYS, UPDATE_USER_LEARNING_JOURNEY_PROGRESS } from "../../lib/graphql";
import { useRouter } from 'next/router';


const StartButton = ({ userId, learningJourneyId, userLearningJourneyData }) => {
  const router = useRouter()

  const {
    load: continueLevel,
    loading: loadingContinueLevel,
    error: errorContinueLevel,
  } = useMutation(UPDATE_USER_LEARNING_JOURNEY_PROGRESS, {
    onCompleted: (data) => {
      // TODO - show alert/toast
      console.log("continue user learning journey ", data);
      return;
    },
    onError: (errorContinueLevel) => {
      // TODO - show alert/toast
      console.log("continue user learning journey error", errorContinueLevel);
      return;
    },
  });

  const {
    load: startLevel,
    loading: loadingStartLevel,
    error: errorStartLevel,
  } = useMutation(ADD_USER_LEARNING_JOURNEYS, {
    onCompleted: (data) => {
      // TODO - show alert/toast
      console.log("add user learning journey ", data);
      return;
    },
    onError: (errorStartLevel) => {
      // TODO - show alert/toast
      console.log("add user learning journey error", errorStartLevel);
      return;
    },
  });
    
  const goToLevel = () => {
    if ( !userLearningJourneyData ) {
    startLevel({
      variables: {
        id: userId,
        learningJourneyId: learningJourneyId,
        progress: 0,
        title: "My First Learning Journey",
      },
    });
    } else {
    continueLevel({
      variables: {
        id: userLearningJourneyData.id,
        updatedAt: new Date(),
        progress: userLearningJourneyData.progress,
        receivedTokens: userLearningJourneyData.receivedTokens,
      }
    });
    router.push({
      pathname: '/learning/journey/[levelId]',
      query: {
        levelId: learningJourneyId,
        step: userLearningJourneyData.progress,
      },
      });
    }
  };

  return (
    <div className="start-level">
      <button className="btn btn-primary" onClick={() => goToLevel()} disabled={loadingContinueLevel || loadingStartLevel}>
        <span className="text-sm">
          {
            userLearningJourneyData ? "Continue this Level1" : "Start this Level1"
          }
        </span>
      </button>
    </div>
  );
};

export default StartButton;