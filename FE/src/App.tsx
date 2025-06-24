// import { BASE_URL } from "./constants";

function App() {
  return (
    <>
      <div className="bg-red-500">
        {/* <button
          onClick={async () => {
            try {
              console.log("here")
              const res = await fetch(`${BASE_URL}/api/v1/healthcheck`, {
                method: "GET",
              });

              if (!res.ok) {
                throw new Error("Health check failed");
              }

              const data = await res.json();
              console.log("Health Check Response:", data);
            } catch (error) {
              console.log("Error:", error)
            }
          }}
        >
          click here
        </button> */}
      </div>
    </>
  );
}

export default App;
