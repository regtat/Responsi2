<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Resep</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :resep="resep"
        @submit="handleSubmit"
      />

      <ion-list>
        <ion-item-sliding v-for="resep in reseps" :key="resep.id">
          <ion-item>
            <ion-label>
              <h2><b>{{ resep.nama }}</b></h2>
              <h5>Langkah-Langkah:</h5>
              <p style="white-space: pre-line;">{{ resep.langkah }}</p>
            </ion-label>
          </ion-item>

          <ion-item-options side="start">
            <ion-item-option color="danger" @click="handleDelete(resep)">
              <ion-icon :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item-options side="end">
            <ion-item-option @click="handleEdit(resep)">
              <ion-icon :icon="create"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel } from '@ionic/vue';
import { add, create, trash } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref } from 'vue';
import { firestoreService, type Resep } from '@/utils/firestore';

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const resep = ref<Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>>({ nama: '', langkah: ''});
const reseps = ref<Resep[]>([]);

const loadReseps = async () => {
  reseps.value = await firestoreService.getReseps();
};

onMounted(() => {
  loadReseps();
});

const handleRefresh = async (event: any) => {
  await loadReseps();
  event.target.complete();
};

const handleSubmit = async (resepData: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingId.value) {
    await firestoreService.updateResep(editingId.value, resepData);
    const index = reseps.value.findIndex((item) => item.id === editingId.value);
    if (index !== -1) {
      reseps.value[index] = { ...reseps.value[index], ...resepData };
    }
  } else {
    const newResep = await firestoreService.addResep(resepData);
    reseps.value.push(newResep); // Add new item to reseps
  }
  loadReseps();
  isOpen.value = false;
};

const handleEdit = (resep: Resep) => {
  editingId.value = resep.id!;
  Object.assign(resep, { ...resep });
  isOpen.value = true;
};

const handleDelete = async (resep: Resep) => {
  await firestoreService.deleteResep(resep.id!);
  loadReseps();
};

const openAddModal = () => {
  editingId.value = null;
  resep.value = { nama: '', langkah: '' }; // Reset form for add
  isOpen.value = true;
};
</script>
