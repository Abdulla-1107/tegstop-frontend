import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export interface IParams {
  search?: string;
  passportCode?: string;
}

export const useFraudsters = () => {
  const queryClient = useQueryClient();

  const getFraudster = (props: IParams) =>
    useQuery({
      queryKey: ["fraudster", props],
      queryFn: () =>
        api.get("fraudster", { params: props }).then((res) => res.data),
    });

  const getFraudsterCount = () =>
    useQuery({
      queryKey: ["fraudster-count"],
      queryFn: () => api.get("fraudster/count").then((res) => res.data),
    });
  const getFraudsterMyCount = () =>
    useQuery({
      queryKey: ["fraudster-my-count"],
      queryFn: () => api.get("fraudster/my-count").then((res) => res.data),
    });

  const getOneFraudster = (id: string) =>
    useQuery({
      queryKey: ["fraudster", id],
      queryFn: () => api.get(`fraudster/${id}`).then((res) => res.data),
    });

  const createFraudster = useMutation({
    mutationFn: (body: any) =>
      api.post("fraudster", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraudster"] });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

  const deleteFraudster = useMutation({
    mutationFn: (id: string) =>
      api.delete(`fraudster/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraudster"] });
    },
  });

  return {
    getFraudster,
    deleteFraudster,
    getFraudsterCount,
    getFraudsterMyCount,
    createFraudster,
    getOneFraudster,
  };
};
