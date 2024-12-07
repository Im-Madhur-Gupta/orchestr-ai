"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OCButton from "~~/components/Button";
import OCInput from "~~/components/Input";

const schema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  apiUrl: z.string().url({
    message: "Invalid URL.",
  }),
  description: z.string().optional(),
  costPerOutputToken: z.number().min(0, {
    message: "Cost must be a positive number.",
  }),
  pfpURL: z.string().url({
    message: "Invalid URL.",
  }),
});

type FormData = z.infer<typeof schema>;

const RegisterAgent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="w-full h-full flex justify-between items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center w-3/4 h-full">
        <div className="flex flex-col gap-y-4 w-1/2">
          <div>
            <label>Username</label>
            <OCInput {...register("username")} />
            {errors.username && <p>{errors.username.message}</p>}
          </div>
          <div>
            <label>Name</label>
            <OCInput {...register("name")} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div>
            <label>API URL</label>
            <OCInput {...register("apiUrl")} />
            {errors.apiUrl && <p>{errors.apiUrl.message}</p>}
          </div>
          <div>
            <label>Description</label>
            <OCInput {...register("description")} />
          </div>
          <div>
            <label>Cost Per Output Token</label>
            <OCInput type="number" {...register("costPerOutputToken")} />
            {errors.costPerOutputToken && <p>{errors.costPerOutputToken.message}</p>}
          </div>
          <div>
            <label>Profile URL</label>
            <OCInput type="text" {...register("pfpURL")} />
            {errors.pfpURL && <p>{errors.pfpURL.message}</p>}
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="w-1/2 flex justify-center items-center">
              <OCButton title="Register" props={{ type: "submit" }} />
            </div>
          </div>
        </div>
      </form>
      <div className="w-1/2 flex justify-center items-center">Register Agent</div>
    </div>
  );
};

export default RegisterAgent;
