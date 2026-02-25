import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/integrations/supabase/client";

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

interface VacationsState {
  items: Vacation[];
  loading: boolean;
}

const initialState: VacationsState = {
  items: [],
  loading: true,
};

export const fetchVacations = createAsyncThunk(
  "vacations/fetch",
  async (userId: string) => {
    const [{ data: vacs }, { data: followers }, { data: counts }] = await Promise.all([
      supabase.from("vacations").select("*"),
      supabase.from("followers").select("vacation_id").eq("user_id", userId),
      supabase.rpc("get_vacation_follower_counts"),
    ]);

    const followedIds = new Set(followers?.map((f) => f.vacation_id) ?? []);
    const countMap = new Map(counts?.map((c) => [c.vacation_id, c.follower_count]) ?? []);

    const mapped: Vacation[] = (vacs ?? []).map((v) => ({
      ...v,
      follower_count: countMap.get(v.id) ?? 0,
      is_following: followedIds.has(v.id),
    }));

    mapped.sort((a, b) => {
      if (a.is_following !== b.is_following) return a.is_following ? -1 : 1;
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    return mapped;
  }
);

const vacationsSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVacations.fulfilled, (state, action: PayloadAction<Vacation[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVacations.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default vacationsSlice.reducer;
