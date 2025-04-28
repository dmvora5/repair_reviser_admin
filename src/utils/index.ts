import { toast } from "sonner";


function findFirstStringError(value: any): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstStringError(item);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const found = findFirstStringError(value[key]);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  return undefined;
}

export function parseAndShowErrorInToast(error: any) {
  let message: string | undefined;
  console.log('error', error)
  

  if (error.error) {

    // if(typeof error.error === 'string') {
    //   parseAndShowErrorInToast({
    //     message:  error.error
    //   });

    //   return;
    // }

    const reError = JSON.parse(error.error);
    parseAndShowErrorInToast({
      message: reError
    });
    return;
  }

  // 1) If it's a standard Error object, use its message.
  if (error instanceof Error) {
    message = error.message;
  }
  // 2) If it's a string, that's our message.
  else if (typeof error === "string") {
    message = error;
  }

  else {
    const data = (error && typeof error === "object" && "data" in error)
      ? (error as any).data
      : error;

    message = findFirstStringError(data);
  }

  // 4) Show the first found string or a generic fallback.
  toast.error(message || "Somting went wrong!", {
    style: {
      backgroundColor: "red",
      color: "white",
      border: 'none'
    },
  })
  // Optional: log for debugging
  console.log("parseAndShowErrorInToast -> error:", error);
}

export const errorToast = (message: string) => {
  toast.error(message || "Somting went wrong!", {
    style: {
      backgroundColor: "red",
      color: "white",
      border: 'none'
    },
  })
}

export const sucessToast = (message: string) => {
  toast.success(message, {
    style: {
      backgroundColor: "green",
      color: "white",
      border: 'none'
    },
  })
}