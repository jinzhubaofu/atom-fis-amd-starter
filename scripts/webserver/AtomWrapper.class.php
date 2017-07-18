<?php

class AtomWrapper {

    private $templateDir = "";
    private $data = array();

    public function setTemplateDir($templateDir) {
        $this->templateDir = $templateDir;
    }

    public function assign($key, $value) {
        $this->data[$key] = $value;
    }

    public function display($template, $component) {

        if (empty($this->templateDir)) {
            throw new Exception("please set template dir first.");
        }

        $absoluteComponentPath = $this->findFile($component);

        if (empty($absoluteComponentPath)) {
            throw new Exception("$component cannot found");
        }

        $absoluteTemplatePath = $this->findFile($template);

        if (empty($absoluteTemplatePath)) {
            throw new Exception("$template cannot found");
        }

        $atom = $this->renderAtom($absoluteComponentPath);

        $this->renderTemplate($absoluteTemplatePath, $atom);

    }

    private function findFile($relativePath) {
        $root = $this->templateDir;
        $absolutePath = "$root/$relativePath";
        return file_exists($absolutePath) ? $absolutePath : null;
    }

    private function renderAtom($componentPath) {

        // 新建实例
        $atom = new Atom();

        $vnode = $atom->renderVNode($componentPath, $this->data);

        // 为支持前端渲染，增加data-server-rendered属性
        $vnode->setAttribute('data-server-rendered', 'true');
        $vnode->setAttribute('atom-root');

        // 渲染结果
        return $atom->renderHtml($componentPath);

    }

    private function renderTemplate($templatePath, $atom) {
        self::render($templatePath, $atom, $this->data);
    }

    private static function render($templatePath, $atom, $data) {
        extract($data);
        include($templatePath);
    }

}
