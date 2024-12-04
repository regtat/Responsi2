<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? "Edit" : "Tambah" }} Resep</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="resep.nama" label="Resep" label-placement="floating" placeholder="Tulis Nama Resep"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea v-model="resep.langkah" label="Langkah" label-placement="floating" placeholder="Tuliskan Langkah-Langkah Memasak" :autogrow="true" :rows="3"></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button type="button" @click="submitForm" shape="round" color="primary" expand="block"> {{ editingId ? "Edit" : "Tambah" }} Resep </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonInput, IonRow, IonCol, IonItem, IonContent, IonTextarea, IonDatetime } from "@ionic/vue";
import { close } from "ionicons/icons";
import { Resep, firestoreService } from "@/utils/firestore";
import { watch, ref } from "vue";

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  resep: Omit<Resep, "id" | "createdAt" | "updatedAt">;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:editingId": [value: string | null];
  submit: [item: Omit<Resep, "id" | "createdAt" | "updatedAt">];
}>();

const cancel = () => {
  emit("update:isOpen", false);
  emit("update:editingId", null);
  resetResep();
};

const submitForm = () => {
  emit("submit", props.resep);
  cancel();
};

const resetResep = () => {
  props.resep.nama = "";
  props.resep.langkah = "";
};

// Watch editingId for changes
watch(
  () => props.editingId,
  async (newEditingId) => {
    if (newEditingId) {
      try {
        const resep = await firestoreService.getResepById(newEditingId);
        if (resep) {
          props.resep.nama = resep.nama;
          props.resep.langkah = resep.langkah;
        }
      } catch (error) {
        console.error("Failed to fetch resep data:", error);
      }
    } else {
      resetResep();
    }
  },
  { immediate: true }
);
</script>
