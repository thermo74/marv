<script>
  import Flexbar from "@/components/UI/Flexbar.svelte";
  import FlexbarSpacer from "@/components/UI/Flexbar/Spacer.svelte";

  import OBSConnect from "@/components/OBS/Connect.svelte";
  import OBSStatus from "@/components/OBS/Status.svelte";
  import StreamStatus from "@/components/Twitch/StreamStatus.svelte";
  import DrawerToggle from "./Drawer/Toggle.svelte";
</script>

<Flexbar bgColor="bg-primary-darker">
  <OBSConnect />
  <OBSStatus />
  <StreamStatus />
  <FlexbarSpacer />
  <DrawerToggle />
</Flexbar>
