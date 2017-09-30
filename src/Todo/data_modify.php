<?php

foreach ($this->data as $key => $value) {
    if ($key == 'title' || $key === 'name') {
         $this->data[$key] = rand() . $value;
    }
}

