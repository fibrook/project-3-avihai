import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVacations, toggleFollowOptimistic } from "@/store/vacationsSlice";
import type { Vacation } from "@/store/vacationsSlice";

export type { Vacation } from "@/store/vacationsSlice";

export function useVacations() {
  const skipRealtimeRef = useRef(false);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const vacations = useAppSelector((state) => state.vacations.items);
  const loading = useAppSelector((state) => state.vacations.loading);

  const refetch = useCallback(() => {
    if (user) dispatch(fetchVacations(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("vacations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "vacations" }, () => refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "followers" }, () => {
        if (skipRealtimeRef.current) {
          skipRealtimeRef.current = false;
          return;
        }
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  async function toggleFollow(vacationId: string) {
    if (!user) return;
    const vacation = vacations.find((v) => v.id === vacationId);
    if (!vacation) return;

    // Skip the next realtime refetch since we're doing optimistic update
    skipRealtimeRef.current = true;
    dispatch(toggleFollowOptimistic(vacationId));

    const { error } = vacation.is_following
      ? await supabase.from("followers").delete().eq("vacation_id", vacationId).eq("user_id", user.id)
      : await supabase.from("followers").insert({ vacation_id: vacationId, user_id: user.id });

    if (error) {
      // Revert on failure
      dispatch(toggleFollowOptimistic(vacationId));
    }
  }

  async function addVacation(data: Omit<Vacation, "id" | "created_at" | "follower_count" | "is_following">) {
    const { error } = await supabase.from("vacations").insert({
      description: data.description,
      destination: data.destination,
      image_url: data.image_url,
      start_date: data.start_date,
      end_date: data.end_date,
      price: data.price,
    });
    return { error };
  }

  async function updateVacation(id: string, data: Partial<Omit<Vacation, "id" | "created_at" | "follower_count" | "is_following">>) {
    const { error } = await supabase.from("vacations").update(data).eq("id", id);
    return { error };
  }

  async function deleteVacation(id: string) {
    const { error } = await supabase.from("vacations").delete().eq("id", id);
    return { error };
  }

  return { vacations, loading, toggleFollow, addVacation, updateVacation, deleteVacation, refetch };
}
