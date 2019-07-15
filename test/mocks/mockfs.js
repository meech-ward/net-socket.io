module.exports = {
  reset() {
    this.unlinks = [];
  },
  unlinks: [],
  unlink(path, cb) {
    this.unlinks.push(path);
    cb();
  }
}