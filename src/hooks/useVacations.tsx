import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Vacation {
  id: string;
  description: string;
  destination: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
  price: number;
  created_at: string;
  follower_count: number;
  is_following: boolean;
}

export function useVacations() {
  const { user } = useAuth();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVacations = useCallback(async () => {
    if (!user) return;

    const [{ data: vacs }, { data: followers }, { data: counts }] = await Promise.all([
      supabase.from("vacations").select("*"),
      supabase.from("followers").select("vacation_id").eq("user_id", user.id),
      supabase.rpc("get_vacation_follower_counts"),
    ]);

    const followedIds = new Set(followers?.map((f) => f.vacation_id) ?? []);
    const countMap = new Map(counts?.map((c) => [c.vacation_id, c.follower_count]) ?? []);

    const mapped: Vacation[] = (vacs ?? []).map((v) => ({
      ...v,
      follower_count: countMap.get(v.id) ?? 0,
      is_following: followedIds.has(v.id),
    }));

    // Sort: followed first, then by start_date
    mapped.sort((a, b) => {
      if (a.is_following !== b.is_following) return a.is_following ? -1 : 1;
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    setVacations(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("vacations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "vacations" }, () => fetchVacations())
      .on("postgres_changes", { event: "*", schema: "public", table: "followers" }, () => fetchVacations())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVacations]);

  async function toggleFollow(vacationId: string) {
    if (!user) return;
    const vacation = vacations.find((v) => v.id === vacationId);
    if (!vacation) return;

    if (vacation.is_following) {
      await supabase.from("followers").delete().eq("vacation_id", vacationId).eq("user_id", user.id);
    } else {
      await supabase.from("followers").insert({ vacation_id: vacationId, user_id: user.id });
    }
    // Realtime will trigger refetch
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

  return { vacations, loading, toggleFollow, addVacation, updateVacation, deleteVacation, refetch: fetchVacations };
}
